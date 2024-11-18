import { supabase } from './supabase';
import type { HistoryItem, HistoryItemInsert } from './types';

export async function getHistory(userId: string) {
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as HistoryItem[];
}

export async function addHistoryItem(item: HistoryItemInsert) {
  const { data, error } = await supabase
    .from('history')
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data as HistoryItem;
}

export async function deleteHistoryItem(id: string, userId: string) {
  const { error } = await supabase
    .from('history')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function clearHistory(userId: string) {
  const { error } = await supabase
    .from('history')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}