// --- Types ---
export type CourseType = "必修" | "選修" | "通識"
export type CourseStatus =
    | "none"
    | "selected"
    | "considering"
    | "conflict"
    | "rejected"
export type ViewType = "lookup" | "plan"

export interface Course {
    id: string
    name: string
    professor: string
    credits: number
    time: string
    location: string
    type: CourseType
    description: string
    syllabus: string // 課程大綱 text
    teachingMaterials: string[] // 教學教材 Array
    teachingMethods: string[] // 教學方式 Array
    assessmentMethods: string[] // 評量方式 Array
    tags: string[]
    prerequisites: string
    restrictions: string
    syllabusUrl: string
    // New Fields
    targetGrade: string // 開課年級
    capacity: number // 限修人數
    supportedPrograms: string // 支援學程
    memo: string
    code: number
}