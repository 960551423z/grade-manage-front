import request from '../utils/request';

// 展示所有
export const StudentListService = (data) => {
  return request.post("/api/student/list",data);
}

// 更新
export const StudentUpdateService = (data) => {
  return request.post("/api/student/update",data);
}


// 删除
export const StudentDeleteService = (id) => {
  return request.get("/api/student/delete",{
    params: {
      id: id
    }
  });
}

// 新增
export const StudentAddService = (data) => {
  return request.post("/api/student/add",data);
}


// 条件查询
export const StudentByNameService = (name) => {
  return request.get("/api/student/list/search", {
    params: {
      name: name
    }
  });
}
