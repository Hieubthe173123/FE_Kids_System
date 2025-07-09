
export interface Parent {
    fullName: string;
    dob: Date;
    phoneNumber: number;
    email: string;
    IDcard: number;
    gender: boolean;
    account: string;
    student: string[];
    address: string;
    images: string;
    status: boolean;
}

export interface Account {
    email: string;
    username: string;
    password: string;
    status: string;
    OTPnumber: string;
    expire_in: Date;
    role: string[];
}

export interface Student {
    fullName: string;
    dob: Date;
    gender: boolean;
    address: string;
    image: string;
    status: boolean;
}

export interface Teacher {
    fullName: string;
    account: string;
    dob: Date;
    phoneNumber: number;
    email: string;
    IDcard: number;
    gender: boolean;
    address: string;
    images: string;
    status: boolean;
}

export interface Feedback {
    student: string;
    teacher: string;
    title: string;
    content: string;
    images: string[];
    status: boolean;
}

export interface Class {
    teacher: string;
    student: string[];
    room: string;
    status: boolean;
}

export interface ScheduleItem {
    activityName: string;
    activityFixed: boolean;
    time: Date;
}

export interface TimeTable {
    schoolYear: string;
    schedules: ScheduleItem[];
    status: boolean;
    class: string;
}

export interface Curriculum {
    activityName: string;
    activityFixed: boolean;
    age: string;
    schoolYear: string;
    activityNumber: number;
    status: boolean;
}

export interface MenuItem {
    mealName: string;
    foodName: string;
}

export interface Menu {
    age: string;
    food: MenuItem[];
    mealDay: Date;
    status: boolean;
}

export interface SchoolInformation {
    schoolName: string;
    address: string;
    phoneNumber: number;
    email: string;
}

export interface RegisterTheAdmission {
    studentName: string;
    studentAge: string;
    studentDob: Date;
    parentName: string;
    parentDob: Date;
    IDcard: number;
    address: string;
    phoneNumber: number;
    email: string;
    reason: string;
    studentImage: string;
    parentImages: string;
}

export interface AccountListItem {
    _id: string;
    fullName: string;
    dob: Date;
    phoneNumber: number;
    email: string;
    IDCard: string | number;
    gender: boolean;
    role: 'parent' | 'teacher';
    account: Partial<Account> | null;
    address: string;
    status: boolean;
    image?: string; // Có thể là 'images' trong Teacher hoặc 'image' từ DB
  
    // Chỉ có khi role === 'parent'
    student?: Student[];
  
    // Optional để dùng chung cho parent / teacher
    createdAt?: Date;
    updatedAt?: Date;
  }
  