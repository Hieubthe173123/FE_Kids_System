import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserApi, loginApi } from "../../services/AuthApi";
import { getUserFromToken } from "../../helper/authHelper";

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await loginApi(username, password);
      const { accessToken } = res;
      if (!accessToken) {
        return thunkAPI.rejectWithValue("Không nhận được accessToken từ server");
      }
      const user = getUserFromToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      return { token: accessToken, user };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await getUserApi();
      localStorage.setItem("user", JSON.stringify(res));
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Lấy thông tin người dùng thất bại"
      );
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
    restoreSession: (state) => {
      try {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
        }
      } catch {
        state.token = null;
        state.user = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user; //Local comment dòng này
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
