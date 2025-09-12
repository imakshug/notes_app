import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from './api';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotes = await apiClient.getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      setError(null);
      const newNote = await apiClient.createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateNote = async (noteId, updateData) => {
    try {
      setError(null);
      const updatedNote = await apiClient.updateNote(noteId, updateData);
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ));
      return updatedNote;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      setError(null);
      await apiClient.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const uploadImage = async (file) => {
    try {
      setError(null);
      const response = await apiClient.uploadImage(file);
      return response.file_url;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const uploadAudio = async (file) => {
    try {
      setError(null);
      const response = await apiClient.uploadAudio(file);
      return response.file_url;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    // Don't fetch automatically - let the component decide when to fetch
    // This prevents hanging on network calls during app initialization
    console.log('useNotes hook initialized, but not auto-fetching');
  }, []);

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    uploadImage,
    uploadAudio,
    clearError: () => setError(null),
  };
};

export const useLinkPreview = () => {
  const previewsRef = useRef({});
  const [previews, setPreviews] = useState({});
  
  const getLinkPreview = useCallback(async (url) => {
    // Check cache first
    const cached = previewsRef.current[url];
    if (cached) {
      return cached;
    }

    try {
      console.log('Fetching link preview for:', url);
      const preview = await apiClient.getLinkPreview(url);
      
      // Store in cache
      const result = preview || { error: true, title: url };
      previewsRef.current[url] = result;
      setPreviews(prev => ({ ...prev, [url]: result }));
      
      return preview;
    } catch (error) {
      console.error('Error fetching link preview:', error);
      
      // Cache error state to prevent repeated calls
      const result = { error: true, title: url };
      previewsRef.current[url] = result;
      setPreviews(prev => ({ ...prev, [url]: result }));
      
      return null;
    }
  }, []);

  return { getLinkPreview, previews };
};