import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from "@ant-design/icons-vue";
import type { FunctionalComponent } from 'vue';  // 函数式组件类型

interface itemsType {
  key: string;
  icon: FunctionalComponent;
  label: string;
  path: string;
  children?: itemsType[];
}

const items: itemsType[] = [
  {
    key: 'home',
    icon: PieChartOutlined,
    label: 'Home',
    path: '/home'
  },
  {
    key: 'homework',
    icon: DesktopOutlined,
    label: '作业',
    path: '/homework',
    children: [
      {
        key: 'homework-sub',
        icon: PieChartOutlined,
        label: 'Sub',
        path: '/homework/sub',
      }
    ]
  },
  {
    key: 'info',
    icon: UserOutlined,
    label: '信息',
    path: '/info',
  },
  {
    key: 'files',
    icon: FileOutlined,
    label: '文件',
    path: '/files',
  },
  {
    key: 'class',
    icon: FileOutlined,
    label: '班级',
    path: '/class',
  },
  {
    key: 'community',
    icon: FileOutlined,
    label: '社区',
    path: '/community',
  },
  {
    key: 'settings',
    icon: TeamOutlined,
    label: '设置',
    path: '/settings',
  }
];

export default items;