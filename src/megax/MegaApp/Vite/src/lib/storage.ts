const get = (key: string): string | null | undefined => {
    return localStorage.getItem(key)
}

const set = (key: string, value: string) => {
    localStorage.setItem(key, value)
}

const remove = (key: string) => {
    localStorage.removeItem(key)
}

export default { get, set, remove } 