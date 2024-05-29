<template>
    <div>
        <TableSearch :query="query"  :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total"
                :delFunc="handleDelete" :changePage="changePage" :editFunc="handleEdit" >
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                </template>
            </TableCustom>
        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { Course } from '@/types/course';
import TableCustom from '@/components/table-custom.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import {
  CourseAddService, CourseDeleteService,
  CourseListService, CourseUpdateService, StudentByLikeService
} from '@/api/course';
import { ElMessage } from "element-plus";
import {StudentAddService, StudentUpdateService} from "@/api/student";


// 查询相关
const query = ref({
  courseName: '',
  instructor: '',
  semester: ''
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '课程名：', prop: 'courseName' },
    { type: 'input', label: '教师：', prop: 'instructor' },
    {
      type: 'select',
      label: '学期',
      prop: 'semester',
      required: true,
      opts: [
        { label: '第一学期', value: "第一学期" },
        { label: '第二学期', value: "第二学期" }
      ],
    },
])
const page = ref({
  index: 1,
  size: 10,
  total: 0,
})


const handleSearch = async () => {
  const requestBody = {
    courseName: query.value.courseName,
    instructor: query.value.instructor,
    semester: query.value.semester,
  };
    const res = await StudentByLikeService(requestBody);
    tableData.value = res.data.data.list;
    page.value.total = res.data.data.pageTotal;

}
const changePage = async (val) => {
  page.value.index = val;
  await getData()
}

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'courseName', label: '课程名' },
    { prop: 'instructor', label: '授课老师' },
    { prop: 'credits', label: '学分' },
    { prop: 'semester', label: '学期' },
    { prop: 'operator', label: '操作', width: 250 },
])

const tableData = ref<Course[]>([]);
const getData = async () => {
    const current = page.value.index
    const pageNum = page.value.size
    const res = await CourseListService({current,pageNum})
    tableData.value = res.data.data.list;
    page.value.total = res.data.data.pageTotal;
};
getData();


// 新增/编辑弹窗相关
let options = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        { type: 'input', label: '课程名', prop: 'courseName', required: true },
        { type: 'input', label: '授课老师', prop: 'instructor', required: true,},
        { type: 'input', label: '学分', prop: 'credits', required: true },
        {
          type: 'select',
          label: '学期',
          prop: 'semester',
          required: true,
          opts: [
            { label: '第一学期', value: '第一学期' },
            { label: '第二学期', value: '第二学期' }
          ]
        },
    ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = async (row: Course) => {
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
}

const updateById = async (data) => {
  try {
    const res = await CourseUpdateService(data);
    console.log(res);
    ElMessage.success('更新成功');
  } catch (error) {
    console.error('更新失败', error);
    ElMessage.error('更新失败');
  }
};

const addData = async (data) => {
  try {
    const res = await CourseAddService(data);
    console.log(res);
    ElMessage.success('新增成功');
  } catch (error) {
    console.error('新增失败', error);
    ElMessage.error('新增失败');
  }
};


const updateData = async (data) => {
    if (isEdit.value) {
      await updateById(data);
    } else {
      await addData(data);
    }
    closeDialog();
    await getData();
};

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};


// 删除相关
const handleDelete = async (row: Course) => {

    const res = await CourseDeleteService(row.courseID);
    if (res.status === 200) {
      ElMessage.success('删除成功');
      await getData();
  }
}


</script>

<style scoped></style>