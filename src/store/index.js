import { configureStore } from "@reduxjs/toolkit";

import { taskAction, taskReducer } from "./slice/task.slice";

export const store = configureStore({
  reducer: {
    taskReducer: taskReducer,
  },
});

store.dispatch(taskAction.findAll())