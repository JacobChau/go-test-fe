import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import { IconQuestionMark } from '@tabler/icons-react';
import UserManagementIcon from '@mui/icons-material/PeopleAltOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import ClassIcon from '@mui/icons-material/Class';

// Define a type for the icons
type IconType = {
    [key: string]: any;
};

const icons: IconType = {
    NavigationOutlinedIcon,
    HomeOutlinedIcon,
    ChromeReaderModeOutlinedIcon,
    AccountTreeOutlinedIcon,
    BlockOutlinedIcon,
    AppsOutlinedIcon,
    ContactSupportOutlinedIcon,
    UserManagementIcon,
    ClassIcon,
    IconQuestionMark,
    QuizIcon
};

// Define types for the menu items
interface Chip {
    label: string;
    color: 'primary' | 'secondary';
}

export interface MenuItem {
    id: string;
    title: string;
    type: 'group' | 'item' | 'collapse';
    icon?: any;
    url?: string;
    target?: boolean;
    disabled?: boolean;
    caption?: string;
    children?: MenuItem[];
    chip?: Chip;
    external?: boolean;
}

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'group',
        icon: icons['NavigationOutlinedIcon'],
        children: [
            {
                id: 'default',
                title: 'Dashboard',
                type: 'item',
                icon: icons['HomeOutlinedIcon'],
                url: '/dashboard',
            }
        ]
    },
    {
        id: 'tests',
        title: 'Tests Management',
        caption: 'Easy to customize',
        type: 'group',
        icon: icons['NavigationOutlinedIcon'],
        children: [
            {
                id: 'test',
                title: 'Test',
                type: 'collapse',
                icon: icons['QuizIcon'],
                children: [
                    {
                        id: 'create-test',
                        title: 'Create Test',
                        type: 'item',
                        url: '/tests/create',
                    },
                    {
                        id: 'test-list',
                        title: 'Test List',
                        type: 'item',
                        url: '/tests',
                    }
                ]
            },
            {
                id: 'test-result',
                title: 'Test Result',
                type: 'item',
                icon: icons['AppsOutlinedIcon'],
                url: '/test-results',
            },
            {
                id: 'question',
                title: 'Question',
                type: 'collapse',
                icon: icons['IconQuestionMark'],
                children: [
                    {
                        id: 'create-question',
                        title: 'Create Question',
                        type: 'item',
                        url: '/questions/create',
                    },
                    {
                        id: 'question-list',
                        title: 'Question Bank',
                        type: 'item',
                        url: '/questions',
                    }
                ]
            }
        ]
    },
    {
        id: 'Management',
        title: 'Management',
        type: 'group',
        icon: icons['NavigationOutlinedIcon'],
        children: [
            {
                id: 'user',
                title: 'User Management',
                type: 'item',
                url: '/users',
                icon: icons['UserManagementIcon'],
            },
            {
                id: 'group',
                title: 'Group Management',
                type: 'item',
                url: '/groups',
                icon: icons['ClassIcon'],
            }
        ]
    }
];

export default menuItems;