export const formatData = (date: string) => {
	const [year, month, day] = date.split('-')
	const formatedDate = new Date(Number(year), Number(month) - 1 , Number(day))

	return formatedDate
}
