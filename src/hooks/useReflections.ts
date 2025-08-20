import { useState, useEffect } from 'react';
import { supabase, Reflection } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useReflections = () => {
  const { userProfile } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchReflections();
    }
  }, [userProfile]);

  const fetchReflections = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reflections:', error);
      } else {
        setReflections(data || []);
      }
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReflection = async (question: string, answer: string) => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('reflections')
        .insert({
          user_id: userProfile.id,
          question,
          answer
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding reflection:', error);
      } else {
        setReflections(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding reflection:', error);
    }
  };

  const updateReflection = async (id: string, answer: string) => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('reflections')
        .update({ 
          answer,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating reflection:', error);
      } else {
        setReflections(prev => prev.map(r => r.id === id ? data : r));
      }
    } catch (error) {
      console.error('Error updating reflection:', error);
    }
  };

  return {
    reflections,
    loading,
    addReflection,
    updateReflection,
    refetch: fetchReflections
  };
};