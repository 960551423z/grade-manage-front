<template>
    <div>
        <TableSearch :query="query"  :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total"
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
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
import {ref, computed, Ref, onMounted} from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { Grade } from '@/types/grade';
import TableCustom from '@/components/table-custom.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';

import {
  allListService,
  GradeAddService,
  GradeDeleteService,
  GradeListService, GradeSearchService,
  GradeUpdateService
} from "@/api/grade";


// 查询相关
const query = ref({
    name: '',
    courseName: ''
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '姓名：', prop: 'name' },
    { type: 'input', label: '课程名：', prop: 'courseName' }
])
const handleSearch = async () => {
    const name = query.value.name
    const courseName = query.value.courseName
    const res = await GradeSearchService({ name,courseName });
    tableData.value = res.data.data.list;
    page.value.total = res.data.data.pageTotal;
    changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'name', label: '姓名' },
    { prop: 'courseName', label: '课程名' },
    { prop: 'grade', label: '分数' },
    { prop: 'semester', label: '学期' },
    { prop: 'operator', label: '操作', width: 250 },
])
const page = ref({
    index: 1,
    size: 10,
    total: 0,
})
const tableData = ref<Grade[]>([]);
const getData = async () => {
    const res = await GradeListService();
    tableData.value = res.data.data.list;
    page.value.total = res.data.data.pageTotal;
};
getData();

const changePage = (val: number) => {
    page.value.index = val;
    getData();
};

const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});

let nameOptions = ref([]);
const courseNameOptions = ref([]);

onMounted(async () => {
  const res = await allListService();
  const { studentsList, coursesList } = res.data.data;
  nameOptions.value = studentsList.map(student => ({
    label: student.name,
    value: student.studentID
  }));

  courseNameOptions.value = coursesList.map(course => ({
    label: course.courseName,
    value: course.courseID
  }));
})

// 新增/编辑弹窗相关
const options : Ref<FormOption> = computed( () => ({
    labelWidth: '100px',
    span: 12,
    list: [
        {
          type: isEdit.value ? 'input' : 'select',
          label: '姓名',
          prop: isEdit.value ? 'name' : 'studentID',
          required: true ,
          disabled: isEdit.value,
          opts: isEdit.value ? undefined : nameOptions.value
        },
        {
          type: isEdit.value ? 'input' : 'select',
          label: '课程名',
          prop:  isEdit.value ? 'courseName' : 'courseID',
          required: true,
          disabled:  isEdit.value,
          opts: isEdit.value ? undefined : courseNameOptions.value
        },
        { type: 'input', label: '分数', prop: 'grade', required: true,  },
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
}))

const handleEdit = async (row: Grade) => {
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
}


const updateById = async (data) => {
  try {
    const res = await GradeUpdateService(data);
    console.log(res);
    ElMessage.success('更新成功');
  } catch (error) {
    console.error('更新失败', error);
    ElMessage.error('更新失败');
  }
};

const addData = async (data) => {
  try {
    const res = await GradeAddService(data);
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
    await getData();
    closeDialog();
};

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};


// 删除相关
const handleDelete = async (row: Grade) => {
    const res = await GradeDeleteService(row.gradeID);
    if (res.status === 200) {
      ElMessage.success('删除成功');
      await getData();
  }
}

</script>

<style scoped></style>