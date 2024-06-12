import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const fetchUserDetails = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://127.0.0.1:5000/api/user/${token}`);
    const data = await response.json();
    dispatch(setUser(data));
  } catch (error) {
    console.log("error fetching user");
  }
};

export default userSlice.reducer;
