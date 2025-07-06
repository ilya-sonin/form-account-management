<template>
	<div class="container mx-auto p-6 max-w-6xl">
		<div class="flex items-center justify-between mb-6">
			<h1 class="text-2xl font-bold text-base-content">Учетные записи</h1>
			<button @click="addNewAccount" class="btn btn-primary btn-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-4 h-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>
			</button>
		</div>

		<div class="alert alert-info mb-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current shrink-0 w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<span>
				Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
			</span>
		</div>

		<div
			class="grid grid-cols-5 gap-2 items-center p-3 bg-base-200 font-medium text-sm mb-2 rounded"
		>
			<div>Метки</div>
			<div>Тип записи</div>
			<div>Логин</div>
			<div>Пароль</div>
			<div class="text-center">Действия</div>
		</div>

		<div class="bg-base-100 border border-base-300 rounded min-h-[200px]">
			<template v-if="accountsStore.accounts.length > 0">
				<AccountRecord
					v-for="account in accountsStore.accounts"
					:key="account.id"
					:account-id="account.id"
				/>
			</template>
			<div v-else class="flex items-center justify-center h-32 text-base-content/50">
				Нет учетных записей. Нажмите "+" чтобы добавить первую запись.
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import AccountRecord from './AccountRecord.vue'

const accountsStore = useAccountsStore()

const addNewAccount = () => {
	accountsStore.addAccount()
}
</script>
