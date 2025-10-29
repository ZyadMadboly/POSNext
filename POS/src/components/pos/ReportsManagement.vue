<template>
	<div class="p-4">
		<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
			<!-- Rush Hour Report -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200">
				<div class="px-4 py-3 border-b border-gray-200">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<div class="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
								<FeatherIcon name="clock" class="w-3 h-3 text-blue-600" />
							</div>
							<h3 class="text-sm font-semibold text-gray-900">Rush Hour Analysis</h3>
						</div>
						<div class="flex items-center space-x-2">
							<span class="text-xs text-gray-500">Today</span>
							<button
								@click="refreshRushHour"
								:disabled="loadingRushHour"
								class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
							>
								<FeatherIcon 
									name="refresh-cw" 
									:class="['w-3 h-3', loadingRushHour ? 'animate-spin' : '']" 
								/>
							</button>
						</div>
					</div>
				</div>
				<div class="p-4">
					<div v-if="loadingRushHour" class="flex items-center justify-center py-8">
						<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
						<span class="ml-2 text-sm text-gray-500">Loading...</span>
					</div>
					<div v-else>
						<template v-if="rushHourData.value?.length > 0">
							<!-- Peak Hour Summary -->
							<div class="mb-4 p-3 bg-blue-50 rounded-lg">
								<div class="flex items-center justify-between">
									<div>
										<p class="text-xs font-medium text-blue-700">Peak Sales Hour</p>
										<p class="text-lg font-bold text-blue-900">{{ peakHour.hour }}</p>
									</div>
									<div class="text-right">
										<p class="text-xs text-blue-600">Quantity Sold</p>
										<p class="text-lg font-bold text-blue-900">{{ peakHour.qty }}</p>
									</div>
								</div>
							</div>
							<!-- Simple Bar Chart -->
							<div class="h-48 flex items-end space-x-1 px-2">
								<div 
									v-for="(hourData, index) in sortedRushHourData" 
									:key="index"
									class="flex-1 flex flex-col items-center"
								>
									<div 
										class="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
										:style="{ height: `${(hourData.qty / maxQuantity) * 100}%` }"
										:title="`${hourData.hour}: ${hourData.qty} items`"
									></div>
									<div class="text-xs text-gray-600 mt-1 transform -rotate-45 origin-left">
										{{ hourData.hour }}
									</div>
								</div>
							</div>
							<!-- Quick Stats -->
							<div class="mt-4 grid grid-cols-2 gap-3">
								<div class="text-center p-2 bg-gray-50 rounded">
									<p class="text-xs text-gray-600">Total Hours Active</p>
									<p class="text-sm font-semibold text-gray-900">{{ rushHourData.value.length }}</p>
								</div>
								<div class="text-center p-2 bg-gray-50 rounded">
									<p class="text-xs text-gray-600">Total Quantity</p>
									<p class="text-sm font-semibold text-gray-900">{{ totalQuantity }}</p>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="text-center py-8">
								<FeatherIcon name="clock" class="w-8 h-8 text-gray-300 mx-auto mb-2" />
								<p class="text-sm text-gray-500">No sales data for today</p>
							</div>
						</template>
					</div>
				</div>
			</div>

			<!-- Sales Invoices Report -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200">
				<div class="px-4 py-3 border-b border-gray-200">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<div class="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
								<FeatherIcon name="file-text" class="w-3 h-3 text-green-600" />
							</div>
							<h3 class="text-sm font-semibold text-gray-900">Sales Summary</h3>
						</div>
						<div class="flex items-center space-x-2">
							<span class="text-xs text-gray-500">Today</span>
							<button
								@click="refreshSalesInvoices"
								:disabled="loadingSalesInvoices"
								class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
							>
								<FeatherIcon 
									name="refresh-cw" 
									:class="['w-3 h-3', loadingSalesInvoices ? 'animate-spin' : '']" 
								/>
							</button>
						</div>
					</div>
				</div>
				<div class="p-4">
					<div v-if="loadingSalesInvoices" class="flex items-center justify-center py-8">
						<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
						<span class="ml-2 text-sm text-gray-500">Loading...</span>
					</div>
					<div v-else>
						<template v-if="salesInvoicesData.value?.length > 0">
							<!-- Sales Summary Cards -->
							<div class="grid grid-cols-2 gap-3 mb-4">
								<div class="p-3 bg-green-50 rounded-lg">
									<p class="text-xs font-medium text-green-700">Total Sales</p>
									<p class="text-lg font-bold text-green-900">{{ formatCurrency(totalSales) }}</p>
								</div>
								<div class="p-3 bg-blue-50 rounded-lg">
									<p class="text-xs font-medium text-blue-700">Total Invoices</p>
									<p class="text-lg font-bold text-blue-900">{{ totalInvoices }}</p>
								</div>
								<div class="p-3 bg-purple-50 rounded-lg">
									<p class="text-xs font-medium text-purple-700">Avg. Invoice</p>
									<p class="text-sm font-bold text-purple-900">{{ formatCurrency(averageInvoice) }}</p>
								</div>
								<div class="p-3 bg-orange-50 rounded-lg">
									<p class="text-xs font-medium text-orange-700">Items Sold</p>
									<p class="text-sm font-bold text-orange-900">{{ totalItemsSold }}</p>
								</div>
							</div>
							<!-- Top Products -->
							<div>
								<h4 class="text-xs font-medium text-gray-700 mb-2">Top Selling Products</h4>
								<div class="space-y-2 max-h-32 overflow-y-auto">
									<div 
										v-for="product in topProducts" 
										:key="product.template_item"
										class="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
									>
										<span class="font-medium text-gray-900 truncate flex-1">{{ product.template_item }}</span>
										<span class="text-green-600 font-semibold ml-2">{{ product.sold_qty }}</span>
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="text-center py-8">
								<FeatherIcon name="file-text" class="w-8 h-8 text-gray-300 mx-auto mb-2" />
								<p class="text-sm text-gray-500">No sales data for today</p>
							</div>
						</template>
					</div>
				</div>
			</div>

			<!-- Placeholder for Future Reports -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 border-dashed">
				<div class="flex items-center justify-center h-64">
					<div class="text-center">
						<FeatherIcon name="plus-circle" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
						<p class="text-sm font-medium text-gray-500">Add More Reports</p>
						<p class="text-xs text-gray-400 mt-1">Future reports will appear here</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { FeatherIcon, createResource } from "frappe-ui"
import { ref, computed, onMounted } from "vue"
// No dialog state here; parent controls pop-up/modal

const props = defineProps({
	warehouse: String,
	currency: {
		type: String,
		default: "USD"
	}
})

// State
const isRefreshing = ref(false)
const loadingRushHour = ref(false)
const loadingSalesInvoices = ref(false)
const rushHourData = ref([])
const salesInvoicesData = ref([])

// Filters
const defaultFromDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
const defaultToDate = new Date().toISOString().split('T')[0]
const filters = ref({
	from_date: defaultFromDate,
	to_date: defaultToDate,
	item: '',
	family_code: '',
	gender: '',
	season_code: '',
	size: '',
	color: '',
	manfacturer_code: '',
	warehouse: props.warehouse ? [props.warehouse] : [],
	part_no: ''
})

// Rush Hour Resource
const rushHourResource = createResource({
	url: "retailing.retailing.report.rush_hour.rush_hour.execute_data",
	makeParams() {
		return {
			filters: { ...filters.value }
		}
	},
	auto: false,
	onSuccess(data) {
        console.log("Rush hour data fetched:", data);
		// The whitelisted method returns the data directly
		rushHourData.value = data
        console.log("Processed rush hour data:", rushHourData.value);
		loadingRushHour.value = false
	},
	onError(error) {
		console.error("Error loading rush hour data:", error)
		rushHourData.value = []
		loadingRushHour.value = false
	}
})

// Sales Invoices Resource (Cashier Today)
const salesInvoicesResource = createResource({
	url: "retailing.retailing.report.sales_invoices.sales_invoices_cashier.get_sales_summary_for_cashier",
	makeParams() {
		// Use current user and today's date, fallback to 'Guest' if not available
		const currentUser = window?.frappe?.session?.user || "Guest";
		return {
			user: currentUser,
			date: filters.value.to_date // always today for now
		}
	},
	auto: false,
	onSuccess(data) {
		// The whitelisted method returns the summary directly
        console.log("Sales invoices data fetched:", data);
		const summary = data || {}
		salesInvoicesData.value = data || []
		// You can also expose summary.total_sales, summary.invoice_count, etc.
		loadingSalesInvoices.value = false
	},
	onError(error) {
		console.error("Error loading sales invoices data:", error)
		salesInvoicesData.value = []
		loadingSalesInvoices.value = false
	}
})

// Computed properties
const peakHour = computed(() => {
	if (rushHourData.value.length === 0) return { hour: "N/A", qty: 0 }
	
	return rushHourData.value.reduce((peak, current) => {
		return (current.qty > peak.qty) ? current : peak
	})
})

const totalQuantity = computed(() => {
	return rushHourData.value.reduce((total, item) => total + (item.qty || 0), 0)
})

const totalSales = computed(() => {
	return salesInvoicesData.value.reduce((total, item) => total + (item.sales_total_with_vat || 0), 0)
})

const totalInvoices = computed(() => {
	const uniqueInvoices = new Set(salesInvoicesData.value.map(item => item.sales_invoice))
	return uniqueInvoices.size
})

const averageInvoice = computed(() => {
	return totalInvoices.value > 0 ? totalSales.value / totalInvoices.value : 0
})

const totalItemsSold = computed(() => {
	return salesInvoicesData.value.reduce((total, item) => total + (item.sold_qty || 0), 0)
})

const topProducts = computed(() => {
	const productTotals = {}
	
	salesInvoicesData.value.forEach(item => {
		const product = item.template_item || item.variant_item
		if (product && product !== "Grand Total") {
			productTotals[product] = (productTotals[product] || 0) + (item.sold_qty || 0)
		}
	})
	
	return Object.entries(productTotals)
		.map(([template_item, sold_qty]) => ({ template_item, sold_qty }))
		.sort((a, b) => b.sold_qty - a.sold_qty)
		.slice(0, 5)
})

// Methods
function refreshRushHour() {
	loadingRushHour.value = true
	rushHourResource.reload()
}

function refreshSalesInvoices() {
	loadingSalesInvoices.value = true
	salesInvoicesResource.reload()
}

function refreshAllReports() {
    isRefreshing.value = true
    refreshRushHour()
    refreshSalesInvoices()
    // Set isRefreshing to false after both requests complete
    setTimeout(() => {
        isRefreshing.value = false
    }, 2000)
}

function handleFilterChange() {
    refreshAllReports()
}

function formatCurrency(amount) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: props.currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount || 0)
}

// Computed properties for simple bar chart visualization
const sortedRushHourData = computed(() => {
	if (!rushHourData.value.length) return []
	
	return [...rushHourData.value].sort((a, b) => {
		// Convert hour strings to 24-hour format for sorting
		const getHour24 = (hourStr) => {
			if (!hourStr) return 0
			const parts = hourStr.split(' ')
			let hour = parseInt(parts[0])
			const ampm = parts[1]
			
			if (ampm === 'AM' && hour === 12) hour = 0
			else if (ampm === 'PM' && hour !== 12) hour += 12
			
			return hour
		}
		
		return getHour24(a.hour) - getHour24(b.hour)
	})
})

const maxQuantity = computed(() => {
	if (!rushHourData.value.length) return 1
	return Math.max(...rushHourData.value.map(item => item.qty))
})

// Initialize reports on mount
onMounted(() => {
	refreshAllReports()
})
</script>