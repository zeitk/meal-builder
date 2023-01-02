import { createContext } from "react";
import { Meal } from '../interfaces/Interfaces'

const MealListContext = createContext<any[]>([]);

export default MealListContext