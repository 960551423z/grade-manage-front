import request from '../utils/request';


// 查询课程和学生信息
export const allListService = () => {
    return request.get("/api/grade/all")
}

// 查询成绩记录
export const GradeListService = () => {
    return request.get("/api/grade/list")
}

// 删除成绩记录
export const GradeDeleteService = (id) => {
    return request.get("/api/grade/delete", {
        params: {
            id: id
        }
    })
}

// 更新成绩记录
export const GradeUpdateService = (data) => {
    return request.post("/api/grade/update",data)
}

// 新增成绩记录
export const GradeAddService = (data) => {
        return request.post("/api/grade/add",data)
}

// 条件查询
export const GradeSearchService = ({name,courseName}) => {
    return request.get("/api/grade/search", {
        params: {
            name: name,
            courseName: courseName
        }
    })
}