import type { Account, AccountTag } from '@/types/account'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccountsStore = defineStore('accounts', () => {
	const accounts = ref<Account[]>([])

	const loadFromStorage = () => {
		const stored = localStorage.getItem('accounts')
		if (stored) {
			try {
				accounts.value = JSON.parse(stored)
			} catch (error) {
				console.error('Ошибка загрузки данных:', error)
				accounts.value = []
			}
		}
	}

	const saveToStorage = () => {
		localStorage.setItem('accounts', JSON.stringify(accounts.value))
	}

	const parseTagsString = (tagsString: string): AccountTag[] => {
		if (!tagsString.trim()) return []
		return tagsString
			.split(';')
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0)
			.map((tag) => ({ text: tag }))
	}

	const addAccount = () => {
		const newAccount: Account = {
			id: Date.now().toString(),
			tags: [],
			accountType: 'Локальная',
			login: '',
			password: '',
		}
		accounts.value.push(newAccount)
		saveToStorage()
	}

	const updateAccount = (
		id: string,
		tagsString: string,
		accountType: 'LDAP' | 'Локальная',
		login: string,
		password: string,
	) => {
		const index = accounts.value.findIndex((acc) => acc.id === id)
		if (index !== -1) {
			accounts.value[index] = {
				id,
				tags: parseTagsString(tagsString),
				accountType,
				login,
				password: accountType === 'LDAP' ? null : password,
			}
			saveToStorage()
		}
	}

	const removeAccount = (id: string) => {
		const index = accounts.value.findIndex((acc) => acc.id === id)
		if (index !== -1) {
			accounts.value.splice(index, 1)
			saveToStorage()
		}
	}

	const getAccount = (id: string) => {
		return accounts.value.find((acc) => acc.id === id)
	}

	loadFromStorage()

	return {
		accounts,
		addAccount,
		updateAccount,
		removeAccount,
		getAccount,
		parseTagsString,
	}
})
