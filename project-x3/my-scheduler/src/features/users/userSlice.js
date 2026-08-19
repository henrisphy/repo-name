import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/endpoints/userApi';

export const fetchTeam = createAsyncThunk(
  'users/fetchTeam',
  async (division, { rejectWithValue }) => {
    try {
      const response = await userApi.getTeam(division);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (username, { rejectWithValue }) => {
    try {
      const response = await userApi.getById(username);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ username, data }, { rejectWithValue }) => {
    try {
      const response = await userApi.update(username, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  team: [],
  allUsers: [],
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
        state.error = null;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch team';
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.allUsers.findIndex(u => u.username === action.payload.username);
        if (index !== -1) {
          state.allUsers[index] = action.payload;
        }
        state.loading = false;
      });
  },
});

export const { clearUserError, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;