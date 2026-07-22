export function formatValue(value: number) {
	return Number(value).toLocaleString('pt-BR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}
