

import { format } from "date-fns"


const formatDate = (date: Date, formatter: string): string => {
    return format(date, formatter)
}



export default { formatDate }