import httpx
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Optional
import re
from datetime import datetime, timedelta

from schemas import LinkPreviewResponse
from models import LinkPreview
from database import SessionLocal


class LinkPreviewService:
    def __init__(self):
        self.timeout = 10.0
        self.max_content_length = 5 * 1024 * 1024  # 5MB
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

    async def fetch_preview(self, url: str) -> LinkPreviewResponse:
        """Fetch link preview with caching."""
        # Check cache first
        db = SessionLocal()
        try:
            cached = db.query(LinkPreview).filter(
                LinkPreview.url == url).first()
            if cached and cached.cache_expiry > datetime.utcnow():
                return LinkPreviewResponse(
                    url=cached.url,
                    title=cached.title,
                    description=cached.description,
                    image=cached.image_url,
                    site_name=cached.site_name
                )
        finally:
            db.close()

        # Fetch fresh data
        preview_data = await self._scrape_url(url)

        # Cache the result
        await self._cache_preview(url, preview_data)

        return preview_data

    async def _scrape_url(self, url: str) -> LinkPreviewResponse:
        """Scrape URL for metadata."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                headers = {"User-Agent": self.user_agent}
                response = await client.get(url, headers=headers, follow_redirects=True)

                if response.status_code != 200:
                    raise Exception(f"HTTP {response.status_code}")

                # Check content length
                content_length = response.headers.get("content-length")
                if content_length and int(content_length) > self.max_content_length:
                    raise Exception("Content too large")

                content_type = response.headers.get("content-type", "")
                if not content_type.startswith("text/html"):
                    raise Exception("Not an HTML page")

                html = response.text
                soup = BeautifulSoup(html, 'html.parser')

                return self._extract_metadata(soup, url)

        except Exception as e:
            # Return basic info if scraping fails
            return LinkPreviewResponse(
                url=url,
                title=self._get_title_from_url(url),
                description=f"Preview of {urlparse(url).netlify}",
                image=None,
                site_name=urlparse(url).netloc
            )

    def _extract_metadata(self, soup: BeautifulSoup, url: str) -> LinkPreviewResponse:
        """Extract metadata from HTML."""
        # Title
        title = self._get_meta_content(soup, ["og:title", "twitter:title"])
        if not title:
            title_tag = soup.find("title")
            title = title_tag.text.strip() if title_tag else self._get_title_from_url(url)

        # Description
        description = self._get_meta_content(soup, [
            "og:description", "twitter:description", "description"
        ])
        if not description:
            # Try to find first paragraph
            p_tag = soup.find("p")
            if p_tag:
                description = p_tag.text.strip(
                )[:200] + "..." if len(p_tag.text.strip()) > 200 else p_tag.text.strip()

        # Image
        image = self._get_meta_content(soup, ["og:image", "twitter:image"])
        if image:
            image = urljoin(url, image)
        else:
            # Try to find first image
            img_tag = soup.find("img", src=True)
            if img_tag:
                image = urljoin(url, img_tag["src"])

        # Site name
        site_name = self._get_meta_content(soup, ["og:site_name"])
        if not site_name:
            site_name = urlparse(url).netloc

        return LinkPreviewResponse(
            url=url,
            title=title,
            description=description,
            image=image,
            site_name=site_name
        )

    def _get_meta_content(self, soup: BeautifulSoup, properties: list) -> Optional[str]:
        """Get content from meta tags."""
        for prop in properties:
            # Try property attribute
            tag = soup.find("meta", property=prop)
            if tag and tag.get("content"):
                return tag["content"].strip()

            # Try name attribute
            tag = soup.find("meta", attrs={"name": prop})
            if tag and tag.get("content"):
                return tag["content"].strip()

        return None

    def _get_title_from_url(self, url: str) -> str:
        """Generate title from URL."""
        parsed = urlparse(url)
        domain = parsed.netloc.replace("www.", "")

        # Special cases for popular sites
        if "youtube.com" in domain or "youtu.be" in domain:
            return "YouTube Video"
        elif "github.com" in domain:
            return "GitHub Repository"
        elif "twitter.com" in domain or "x.com" in domain:
            return "Twitter Post"
        elif "linkedin.com" in domain:
            return "LinkedIn Post"
        elif "stackoverflow.com" in domain:
            return "Stack Overflow Question"
        elif "medium.com" in domain:
            return "Medium Article"
        else:
            return f"{domain.title()} - Web Page"

    async def _cache_preview(self, url: str, preview: LinkPreviewResponse):
        """Cache preview data."""
        db = SessionLocal()
        try:
            # Check if exists
            existing = db.query(LinkPreview).filter(
                LinkPreview.url == url).first()

            cache_expiry = datetime.utcnow() + timedelta(days=7)  # Cache for 7 days

            if existing:
                # Update existing
                existing.title = preview.title
                existing.description = preview.description
                existing.image_url = preview.image
                existing.site_name = preview.site_name
                existing.last_updated = datetime.utcnow()
                existing.cache_expiry = cache_expiry
            else:
                # Create new
                link_preview = LinkPreview(
                    url=url,
                    title=preview.title,
                    description=preview.description,
                    image_url=preview.image,
                    site_name=preview.site_name,
                    cache_expiry=cache_expiry
                )
                db.add(link_preview)

            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Error caching preview: {e}")
        finally:
            db.close()


# Service instance
link_service = LinkPreviewService()


async def get_link_preview(url: str) -> LinkPreviewResponse:
    """Public function to get link preview."""
    return await link_service.fetch_preview(url)
