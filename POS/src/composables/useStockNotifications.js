import { ref } from "vue"
import { createResource } from "frappe-ui"

export function useStockNotifications(warehouse) {
	const count = ref(0)
	const loading = ref(false)

	// Resource to fetch notification count
	const fetchCount = createResource({
		url: "retailing.api.stock_entries.get_pending_stock_entries_count",
		makeParams() {
			return { pos_profile_warehouse: warehouse.value }
		},
		auto: false,
		onSuccess(data) {
			count.value = data || 0
			loading.value = false
		},
		onError() {
			count.value = 0
			loading.value = false
		}
	})

	function refreshCount() {
		if (!warehouse.value) {
			count.value = 0
			return
		}
		
		loading.value = true
		fetchCount.reload()
	}

	return {
		count,
		loading,
		refreshCount
	}
}