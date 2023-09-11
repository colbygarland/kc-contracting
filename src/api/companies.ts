import { getFromDatabase, writeToDatabase } from '.'

export interface Company {
  name: string
  id?: string
  createdAt?: string
  updatedAt?: string
  // If this is set, consider the company deleted
  deletedAt?: string | null
}

const PATH = 'companies'

export const createCompany = async (
  company: Record<string, unknown>,
): Promise<boolean> => {
  try {
    await writeToDatabase({ data: company, path: PATH })
    return true
  } catch (error) {
    console.error(`Error creating company. Error: ${error}`)
    return false
  }
}

export const updateCompany = async (
  company: Record<string, unknown>,
): Promise<boolean> => {
  try {
    await writeToDatabase({
      data: company,
      path: PATH,
      id: company.id as string,
    })
    return true
  } catch (error) {
    console.error(`Error creating company. Error: ${error}`)
    return false
  }
}

export const deleteCompany = async () => {}

export const getCompany = async (
  companyId: string,
): Promise<Company | null> => {
  try {
    const company = await getFromDatabase(`${PATH}/${companyId}`)
    if (!company) {
      return null
    }
    return company as unknown as Company
  } catch (error) {
    console.error(`Error creating company. Error: ${error}`)
    return null
  }
}

export const getAllCompanies = async (): Promise<Array<Company>> => {
  try {
    const companies = await getFromDatabase(PATH)
    if (!companies) {
      return []
    }

    const companiesToArray = Object.values(companies)
    return companiesToArray as unknown as Array<Company>
  } catch (error) {
    console.error(`Error getting all companies. Error: ${error}`)
    return []
  }
}
