import request from '../utils/request';


// 查询所有
export const CourseListService = (data) => {
    return request.post("/api/course/list",data)
}

// 更新
export const CourseUpdateService = (data) => {
    return request.post("/api/course/update",data)
}

// 新增
export const CourseAddService = (data) => {
    return request.post("/api/course/add",data)
}


// 删除
export const CourseDeleteService = (id) => {
    return request.get("/api/course/delete", {
        params: {
            id: id
        }
    })
}

// 条件查询
export const StudentByLikeService = (data) => {
    return request.post("/api/course/search",data)
}