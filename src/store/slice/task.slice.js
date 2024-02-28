import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const findAll = createAsyncThunk("tasks/findAll", async () => {
  let res = await axios.get("http://localhost:3000/tasks");
  return res.data;
});

export const taskSlice = createSlice({
  name: "task",
  initialState: {
    data: [],
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    addData: (state, action) => {
      state.data.push(action.payload);
    },
    deleteData: (state, action) => {
      const id = action.payload;
      const index = state.data.findIndex((user) => user.id == id);
      state.data.splice(index, 1);
    },
    updateData: (state, action) => {
      const index = state.data.findIndex((task) => task.id == action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload };
      }
    },
   

  },

  extraReducers: (builder) => {
    builder.addCase(findAll.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const taskReducer = taskSlice.reducer;
export const taskAction = {
  ...taskSlice.actions,
  findAll,
};
