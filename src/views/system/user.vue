<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total"
                :delFunc="handleDelete" :changePage="changePage" :editFunc="handleEdit">
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
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User } from '@/types/user';
import TableCustom from '@/components/table-custom.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import {
  StudentAddService,
  StudentByNameService,
  StudentDeleteService,
  StudentListService,
  StudentUpdateService
} from '@/api/student';

// 查询相关
const query = reactive({
    name: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '姓名：', prop: 'name' }
])
const handleSearch = async () => {
    const res = await StudentByNameService(query.name);
    tableData.value = res.data.data.list;
    page.value.total = res.data.data.pageTotal;
    // changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'name', label: '姓名' },
    { prop: 'phoneNumber', label: '手机号' },
    { prop: 'className', label: '班级' },
    {
      prop: 'gender',
      label: '性别',
      formatter: (row) => {
        // 根据返回的 gender 值进行转换
        return row === 1 ? '男' : row === 0 ? '女' : '';
      }
    },
    { prop: 'operator', label: '操作', width: 250 },
])
const page = ref({
    index: 1,
    size: 10,
    total: 0,
})
const tableData = ref<User[]>([]);
const getData = async () => {

    const current = page.value.index
    const pageNum = page.value.size
    const res = await StudentListService({current,pageNum})
    tableData.value = res.data.data.list;
    page.value.total = res.data.data.pageTotal;
};
getData();

const changePage = async (val) => {
    page.value.index = val;
    await getData()
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        { type: 'input', label: '姓名', prop: 'name', required: true },
        {
          type: 'input',
          label: '手机号',
          prop: 'phoneNumber',
          required: true,
          rules: true
        },
        { type: 'input', label: '班级', prop: 'className', required: true },
        {
          type: 'select',
          label: '性别',
          prop: 'gender',
          required: true,
          opts: [
            { label: '男', value: 1 },
            { label: '女', value: 0 }
          ]
        }
    ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = async (row: User) => {
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
}



const updateById = async (data) => {
  try {
    const res = await StudentUpdateService(data);
    console.log(res);
    ElMessage.success('更新成功');
  } catch (error) {
    console.error('更新失败', error);
    ElMessage.error('更新失败');
  }
};

const addData = async (data) => {
  try {
    const res = await StudentAddService(data);
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
  await getData(); // 假设这是一个重新获取数据的方法
}

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};



// 删除相关
const handleDelete = async (row: User) => {
    const res = await StudentDeleteService(row.studentID);
    if (res.status === 200) {
      ElMessage.success('删除成功');
      await getData();
  }
}

// 请求

</script>

<style scoped></style>