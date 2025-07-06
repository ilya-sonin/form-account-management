<template>
	<div class="grid grid-cols-5 gap-2 items-start p-2 border-b border-base-300">
		<div>
			<input
				v-model="formData.tagsString"
				@blur="handleTagsBlur"
				type="text"
				placeholder="Введите метки через ;"
				title="Необязательное поле. Максимум 50 символов. Используйте знак ; для разделения нескольких меток"
				maxlength="50"
				class="input input-sm w-full border-base-300 focus:border-primary"
			/>
		</div>

		<div>
			<select
				v-model="formData.accountType"
				@change="handleAccountTypeChange"
				title="Выберите тип учетной записи. LDAP - пароль скрывается, Локальная - пароль обязателен"
				class="select select-sm w-full border-base-300 focus:border-primary"
			>
				<option value="Локальная">Локальная</option>
				<option value="LDAP">LDAP</option>
			</select>
		</div>

		<div>
			<input
				v-model="formData.login"
				@blur="handleLoginBlur"
				type="text"
				placeholder="Введите логин"
				title="Обязательное поле. Максимум 100 символов. Имя пользователя для входа в систему"
				maxlength="100"
				class="input input-sm w-full border-base-300 focus:border-primary"
				:class="{ 'input-error border-red-500': formData.errors.login }"
			/>
		</div>

		<div>
			<div v-if="formData.accountType === 'Локальная'" class="relative">
				<input
					ref="passwordInput"
					v-model="formData.password"
					@blur="handlePasswordBlur"
					:type="passwordVisible ? 'text' : 'password'"
					placeholder="Введите пароль"
					title="Обязательное поле для локальных записей. Максимум 100 символов. Пароль для входа в систему"
					maxlength="100"
					class="input input-sm w-full pr-8 border-base-300 focus:border-primary"
					:class="{ 'input-error border-red-500': formData.errors.password }"
				/>
				<button
					@click="togglePasswordVisibility"
					title="Показать/скрыть пароль"
					class="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
					type="button"
				>
					<svg
						v-if="passwordVisible"
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
							d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
						/>
					</svg>
					<svg
						v-else
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
							d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</button>
			</div>
			<div
				v-else
				class="text-sm text-base-content/50 pt-2"
				title="Для LDAP записей пароль не требуется"
			>
				Скрыто
			</div>
		</div>

		<div class="flex gap-1 justify-center">
			<button
				@click="handleRemove"
				title="Удалить учетную запись"
				class="btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content"
				type="button"
			>
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
						d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import type { AccountFormData } from '@/types/account'
import { onMounted, ref } from 'vue'

interface Props {
	accountId: string
}

const props = defineProps<Props>()
const accountsStore = useAccountsStore()

const formData = ref<AccountFormData>({
	id: props.accountId,
	tagsString: '',
	accountType: 'Локальная',
	login: '',
	password: '',
	errors: {
		login: false,
		password: false,
	},
})

const passwordVisible = ref(false)
const passwordInput = ref<HTMLInputElement>()

const loadAccountData = () => {
	const account = accountsStore.getAccount(props.accountId)
	if (account) {
		formData.value.tagsString = account.tags.map((tag) => tag.text).join('; ')
		formData.value.accountType = account.accountType
		formData.value.login = account.login
		formData.value.password = account.password || ''
	}
}

const validateField = (field: 'login' | 'password') => {
	if (field === 'login') {
		formData.value.errors.login = formData.value.login.trim() === ''
	} else if (field === 'password') {
		formData.value.errors.password =
			formData.value.accountType === 'Локальная' && formData.value.password.trim() === ''
	}
}

const validateAll = () => {
	validateField('login')
	validateField('password')
	return !formData.value.errors.login && !formData.value.errors.password
}

const saveAccount = () => {
	if (validateAll()) {
		accountsStore.updateAccount(
			formData.value.id,
			formData.value.tagsString,
			formData.value.accountType,
			formData.value.login,
			formData.value.password,
		)
	}
}

const handleTagsBlur = () => {
	saveAccount()
}

const handleAccountTypeChange = () => {
	if (formData.value.accountType === 'LDAP') {
		formData.value.password = ''
		formData.value.errors.password = false
	}
	saveAccount()
}

const handleLoginBlur = () => {
	validateField('login')
	saveAccount()
}

const handlePasswordBlur = () => {
	validateField('password')
	saveAccount()
}

const togglePasswordVisibility = () => {
	passwordVisible.value = !passwordVisible.value
}

const handleRemove = () => {
	accountsStore.removeAccount(props.accountId)
}

onMounted(() => {
	loadAccountData()
})
</script>
