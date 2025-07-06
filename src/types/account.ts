export interface AccountTag {
	text: string
}

export type AccountType = 'LDAP' | 'Локальная'

export interface Account {
	id: string
	tags: AccountTag[]
	accountType: AccountType
	login: string
	password: string | null
}

export interface AccountFormData {
	id: string
	tagsString: string
	accountType: AccountType
	login: string
	password: string
	errors: {
		login: boolean
		password: boolean
	}
}
