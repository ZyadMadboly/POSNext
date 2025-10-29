<template>
	<div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
			<!-- Background overlay -->
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="closeModal"></div>

			<!-- Modal panel -->
			<div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden relative z-10">
				<div class="bg-white px-6 py-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-semibold text-gray-900">
							Pending Stock Transfers
						</h3>
						<button @click="closeModal" class="text-gray-400 hover:text-gray-600">
							<FeatherIcon name="x" class="w-6 h-6" />
						</button>
					</div>

					<!-- Loading state -->
					<div v-if="loading" class="flex justify-center py-8">
						<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					</div>

					<!-- Stock Entries List -->
					<div v-else-if="stockEntries.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
						<div 
							v-for="entry in stockEntries" 
							:key="entry.name"
							class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
							@click="navigateToStockEntry(entry.name)"
						>
							<div class="flex items-center justify-between mb-3">
								<div class="flex items-center space-x-3">
									<div class="bg-orange-100 p-2 rounded-lg">
										<FeatherIcon name="package" class="w-5 h-5 text-orange-600" />
									</div>
									<div>
										<h4 class="font-medium text-gray-900">{{ entry.name }}</h4>
										<p class="text-sm text-gray-500">{{ entry.stock_entry_type || entry.purpose }}</p>
									</div>
								</div>
								<div class="text-right">
									<div class="text-sm font-medium text-gray-900">
										{{ entry.pending_items }}/{{ entry.total_items }} items pending
									</div>
									<div class="text-xs text-gray-500">
										{{ formatDate(entry.posting_date) }}
									</div>
								</div>
							</div>

							<div v-if="entry.custom_shipment_id" class="mb-3 p-2 bg-blue-50 rounded">
								<div class="text-sm text-blue-700">
									Shipment: {{ entry.custom_shipment_id }}
								</div>
							</div>

							<div class="mb-3 text-sm text-gray-600">
								<div class="flex items-center justify-between">
									<span>From: {{ entry.from_warehouse || 'N/A' }}</span>
									<FeatherIcon name="arrow-right" class="w-4 h-4 text-gray-400" />
									<span>To: {{ entry.to_warehouse || entry.custom_target_branch }}</span>
								</div>
							</div>

							<div class="space-y-2">
								<div class="text-sm font-medium text-gray-700">Pending Items:</div>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
									<div 
										v-for="item in entry.items.slice(0, 4)" 
										:key="item.item_code"
										class="bg-gray-50 p-2 rounded text-xs"
									>
										<div class="font-medium">{{ item.item_name || item.item_code }}</div>
										<div class="text-gray-600">
											Qty: {{ item.qty }} {{ item.stock_uom }}
										</div>
									</div>
								</div>
								<div v-if="entry.items.length > 4" class="text-xs text-gray-500 text-center">
									... and {{ entry.items.length - 4 }} more items
								</div>
							</div>

							<div class="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
								<span class="text-gray-600">Total Pending: {{ entry.pending_qty || 0 }}</span>
								<span class="font-medium text-gray-900">
									Value: {{ entry.pending_value || 0 }}
								</span>
							</div>
						</div>
					</div>

					<!-- Empty state -->
					<div v-else-if="!loading" class="text-center py-8">
						<FeatherIcon name="check-circle" class="w-12 h-12 text-green-500 mx-auto mb-4" />
						<h3 class="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
						<p class="text-gray-500">No pending stock transfers at the moment.</p>
					</div>
				</div>

				<div class="bg-gray-50 px-6 py-3 flex justify-end">
					<button
						type="button"
						class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
						@click="closeModal"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { FeatherIcon } from "frappe-ui"
import { ref, watch } from "vue"
import { createResource } from "frappe-ui"

const props = defineProps({
	isOpen: Boolean,
	warehouse: String
})

const emit = defineEmits(["close"])

const stockEntries = ref([])
const loading = ref(false)

// Resource to fetch stock entries
const fetchStockEntries = createResource({
	url: "retailing.api.stock_entries.get_pending_stock_entries",
	makeParams() {
		return { pos_profile_warehouse: props.warehouse }
	},
	auto: false,
	onSuccess(data) {
		stockEntries.value = data || []
		loading.value = false
	},
	onError() {
		stockEntries.value = []
		loading.value = false
	}
})

// Watch for modal open and fetch data
watch(() => props.isOpen, (isOpen) => {
	if (isOpen && props.warehouse) {
		loading.value = true
		fetchStockEntries.reload()
	}
})

function closeModal() {
	emit("close")
}

function navigateToStockEntry(stockEntryName) {
	window.open(`/app/stock-entry/${stockEntryName}`, '_blank')
}

function formatDate(dateString) {
	if (!dateString) return 'N/A'
	try {
		return new Date(dateString).toLocaleDateString()
	} catch (e) {
		return dateString
	}
}
</script>