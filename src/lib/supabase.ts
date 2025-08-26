import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface PageView {
  id?: string;
  page: string;
  user_agent?: string;
  referrer?: string;
  created_at?: string;
}

export interface FilterUsage {
  id?: string;
  filter_name: string;
  search_term?: string;
  created_at?: string;
}

// Contact form submission
export const submitContact = async (data: Omit<ContactSubmission, 'id' | 'created_at'>) => {
  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([data])
    .select();
  
  if (error) throw error;
  return result;
};

// Track page views
export const trackPageView = async (page: string) => {
  const { error } = await supabase
    .from('page_views')
    .insert([{
      page,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null
    }]);
  
  if (error) console.error('Error tracking page view:', error);
};

// Track filter usage
export const trackFilterUsage = async (filterName: string, searchTerm?: string) => {
  const { error } = await supabase
    .from('filter_usage')
    .insert([{
      filter_name: filterName,
      search_term: searchTerm || null
    }]);
  
  if (error) console.error('Error tracking filter usage:', error);
};