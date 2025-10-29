<template>
	<!-- Icon-Only Sidebar - Hidden on Mobile, Visible on Desktop -->
	<div class="hidden lg:flex w-16 flex-shrink-0 bg-white border-r border-gray-200 flex-col items-center py-4 space-y-2">
		<!-- Dashboard -->
		<button
			@click="handleMenuClick('dashboard')"
			:class="[
				'w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group',
				activeMenu === 'dashboard'
					? 'bg-blue-100 text-blue-600'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
			]"
			:title="'Dashboard'"
		>
			<FeatherIcon name="layout" class="w-5 h-5" />
			<div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
				Dashboard
			</div>
		</button>

		<!-- Promotions -->
		<button
			@click="handleMenuClick('promotions')"
			:class="[
				'w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group',
				activeMenu === 'promotions'
					? 'bg-green-100 text-green-600'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
			]"
			:title="'Promotions'"
		>
			<FeatherIcon name="tag" class="w-5 h-5" />
			<div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
				Promotions
			</div>
		</button>

		<!-- Products -->
		<button
			@click="handleMenuClick('products')"
			:class="[
				'w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group',
				activeMenu === 'products'
					? 'bg-purple-100 text-purple-600'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
			]"
			:title="'Products'"
		>
			<FeatherIcon name="package" class="w-5 h-5" />
			<div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
				Products
			</div>
		</button>

		<!-- Reports -->
		<button
			@click="handleMenuClick('reports')"
			:class="[
				'w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group',
				activeMenu === 'reports'
					? 'bg-orange-100 text-orange-600'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
			]"
			:title="'Reports'"
		>
			<FeatherIcon name="bar-chart-2" class="w-5 h-5" />
			<div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
				Reports
			</div>
		</button>

		<!-- Stock Entry Notifications -->
		<button
			@click="handleMenuClick('stock-notifications')"
			:class="[
				'w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group',
				activeMenu === 'stock-notifications'
					? 'bg-red-100 text-red-600'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
			]"
			:title="'Pending Stock Transfers'"
		>
			<FeatherIcon name="truck" class="w-5 h-5" />
			<!-- Notification Badge -->
			<div 
				v-if="stockNotificationCount > 0"
				class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
			>
				{{ stockNotificationCount > 99 ? '99+' : stockNotificationCount }}
			</div>
			<div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
				Stock Transfers
			</div>
		</button>

		<!-- Invoices -->
		<button
			@click="handleMenuClick('invoices')"
			:class="[
				'w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group',
				activeMenu === 'invoices'
					? 'bg-indigo-100 text-indigo-600'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
			]"
			:title="'Invoice Management'"
		>
			<FeatherIcon name="file-text" class="w-5 h-5" />
			<div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
				Invoice Management
			</div>
		</button>

		<!-- Divider -->
		<div class="w-8 border-t border-gray-200 my-2"></div>

		<!-- Settings -->
		<button
			@click="handleMenuClick('settings')"
			:class="[
				'w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group',
				activeMenu === 'settings'
					? 'bg-gray-100 text-gray-900'
					: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
			]"
			:title="'Settings'"
		>
			<FeatherIcon name="settings" class="w-5 h-5" />
			<div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
				Settings
			</div>
		</button>
	</div>
</template>

<script setup>
import { FeatherIcon } from "frappe-ui"
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useStockNotifications } from "@/composables/useStockNotifications"

const emit = defineEmits(["menu-clicked"])

const activeMenu = ref("")

const props = defineProps({
	warehouse: String
})

// Use stock notifications composable
const warehouseRef = computed(() => props.warehouse)
const { count: stockNotificationCount, refreshCount } = useStockNotifications(warehouseRef)

let pollInterval = null

function handleMenuClick(menuItem) {
	activeMenu.value = menuItem
	emit("menu-clicked", menuItem)
}

function startPolling() {
	pollInterval = setInterval(() => {
		refreshCount()
	}, 30000) // Poll every 30 seconds
}

function stopPolling() {
	if (pollInterval) {
		clearInterval(pollInterval)
		pollInterval = null
	}
}

onMounted(() => {
	refreshCount()
	startPolling()
})

onUnmounted(() => {
	stopPolling()
})

watch(() => props.warehouse, () => {
	refreshCount()
})
</script>
