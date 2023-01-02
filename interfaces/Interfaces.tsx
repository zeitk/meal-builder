export interface Meal {
    name: String,
    foods: any
}

export interface Food {
    [key: string]: any,
    id: number,
    image: string,
    name: string
}

