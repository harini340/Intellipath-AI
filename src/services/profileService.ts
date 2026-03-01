import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export const profileService = {
  /**
   * Creates or updates a user profile
   */
  async upsertProfile(profile: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }
    return data;
  },

  /**
   * Fetches a user profile by ID
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    return data;
  },

  /**
   * Test function to verify the signup -> profile -> fetch flow
   * This can be called from a debug menu or test button
   */
  async runTestFlow(userId: string, fullName: string) {
    console.log('--- Starting Profile Test Flow ---');
    
    try {
      // 1. Simulate Profile Creation
      console.log('Step 1: Inserting test profile...');
      const testProfile: Partial<Profile> = {
        id: userId,
        full_name: fullName,
        education_level: 'undergraduate',
        career_goal: 'Software Engineer (Test)',
        skill_assessment: {
          coding: 75,
          aptitude: 80,
          communication: 85
        },
        learning_preference: 'practical',
        weekly_study_time: 15
      };
      
      const inserted = await this.upsertProfile(testProfile);
      console.log('Successfully inserted:', inserted);

      // 2. Simulate Dashboard Fetch
      console.log('Step 2: Fetching profile for dashboard...');
      const fetched = await this.getProfile(userId);
      console.log('Successfully fetched:', fetched);

      console.log('--- Test Flow Completed Successfully ---');
      return { success: true, data: fetched };
    } catch (error: any) {
      console.error('--- Test Flow Failed ---');
      return { success: false, error: error.message };
    }
  }
};
