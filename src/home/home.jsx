import { useEffect, useState } from "react";
import "./home.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { taskAction } from "../store/slice/task.slice";
export default function home() {
  const [isModelDelete, setIsModelDelete] = useState(false);
  const [isModelAlert, setIsModelAlert] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const taskList = useSelector((store) => store.taskReducer);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    const taskName = e.target.taskName.value;
    if (!taskName) {
      setIsModelAlert(true);
      return;
    }
    const addTask = {
      taskName,
      status: false,
    };
    //add data
    const addData = async () => {
      try {
        const res = await axios
          .post("http://localhost:3000/tasks", addTask, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            dispatch(taskAction.addData(response.data));
          });
        console.log("data add", res.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    addData();
  };

  //delete
  const handleDelete = (e, id) => {
    e.preventDefault();
    setIsModelDelete(true);
    setTaskId(id);
  };

  const confirmDelete = async (id) => {
    try {
      const res = await axios
        .delete(`http://localhost:3000/tasks/${id}`)
        .then((response) => {
          dispatch(taskAction.deleteData(response.data.id));
        });

      console.log("data delete", res.data);
    } catch (error) {
      console.log("error", error);
    }
    setIsModelDelete(false);
  };

  //handlecheck

  const handleChecked = async (e,task) => {
    const checked = e.target.checked;

    const updateTask = {...task, status:checked}
    console.log("updateTask", updateTask);
    console.log(updateTask.id);
    try {
             await axios.patch(
               `http://localhost:3000/tasks/${updateTask.id}`,
               updateTask
             );

    } catch (error) {
        console.log("error",error);
    }
    setIsChecked(checked)
    // dispatch(taskAction.updateData(updateTask))
    
     // Cập nhật trạng thái của task trong bản sao
     
  };

  //task uncompleted
  const taskUnCompleted = async () => {

    try {
         await axios
          .get("http://localhost:3000/tasks?status=0")
          .then((res) => {
                    console.log("res", res.data);

            dispatch(taskAction.setData(res.data));
          });
    } catch (error) {
        console.log("error", error);
    }
  };
  const taskCompleted = async () => {
    try {
       await axios
        .get("http://localhost:3000/tasks?status=1")
        .then((res) => {

          dispatch(taskAction.setData(res.data));
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  const showAllTask = async () => {
    try {
      await axios.get("http://localhost:3000/tasks").then((res) => {
        dispatch(taskAction.setData(res.data));
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <form
                    className="d-flex justify-content-center align-items-center mb-4"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-outline flex-fill">
                      <input
                        type="text"
                        id="form2"
                        className="form-control"
                        name="taskName"
                      />
                      <label className="form-label" htmlFor="form2">
                        Nhập tên công việc
                      </label>
                    </div>
                    <button type="submit" className="btn btn-info ms-2">
                      Thêm
                    </button>
                  </form>

                  {/* <!-- Tabs navs --> */}
                  <ul className="nav nav-tabs mb-4 pb-2">
                    <li className="nav-item" role="presentation">
                      <a className="nav-link active"
                      onClick={()=>{
                        showAllTask()
                      }}
                      >Tất cả</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link"
                      onClick={()=>{
                        taskCompleted();
                      }}>Đã hoàn thành</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        onClick={() => {
                          taskUnCompleted();
                        }}
                      >
                        Chưa hoàn thành
                      </a>
                    </li>
                  </ul>
                  {/* <!-- Tabs navs --> */}

                  {/* <!-- Tabs content --> */}
                  <div className="tab-content" id="ex1-content">
                    <div className="tab-pane fade show active">
                      <ul className="list-group mb-0">
                        {taskList.data?.map((task, index) => {
                          return (
                            <li
                              className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
                              style={{ backgroundColor: "f3f6f7" }}
                              key={index}
                            >
                              <div>
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(event) => {
                                    handleChecked(event, task);
                                  }}
                                />
                                {/* {isChecked ? (
                                  <s>{task.taskName}</s>
                                ) : (
                                )} */}
                                <span>{task.taskName}</span>
                              </div>
                              <div className="d-flex gap-3">
                                <i className="fas fa-pen-to-square text-warning"></i>
                                <i
                                  className="far fa-trash-can text-danger"
                                  onClick={(event) => {
                                    handleDelete(event, task.id);
                                  }}
                                ></i>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal xác nhận xóa --> */}
      <div className={`overlay ${isModelDelete ? "" : "hidden"}`}>
        <div className="modal-custom">
          <div className="modal-header-custom">
            <h5>Xác nhận</h5>
            <i className="fas fa-xmark"></i>
          </div>
          <div className="modal-body-custom">
            <p>Bạn chắc chắn muốn xóa công việc nay?</p>
          </div>
          <div className="modal-footer-footer">
            <button
              className="btn btn-light"
              onClick={() => {
                setIsModelDelete(false);
              }}
            >
              Hủy
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                confirmDelete(taskId);
              }}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* <!-- Modal cảnh báo lỗi --> */}
      <div className={`overlay ${isModelAlert ? "" : "hidden"}`}>
        <div className="modal-custom">
          <div className="modal-header-custom">
            <h5>Cảnh báo</h5>
            <i className="fas fa-xmark"></i>
          </div>
          <div className="modal-body-custom">
            <p>Tên công việc không được phép để trống.</p>
          </div>
          <div className="modal-footer-footer">
            <button
              className="btn btn-light"
              onClick={() => {
                setIsModelAlert(false);
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
