import { test, expect } from '@playwright/test'

test.describe('Teste do Crud de Despesas', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login')
        await page.fill('input#email', 'milena@gmail.com')
        await page.fill('input#senha', 'TripPlanner03@')
        await page.click('button[type="submit"]')
        
        await page.waitForURL('http://localhost:5173/', { timeout: 10000 })

        await page.locator('.viagemCadastrada').first().click()
    })

    test('O usuário irá criar, listar, atualizar e remover uma despesa com sucesso', async ({ page }) => {
        
        await page.goto('http://localhost:5173/info-viagem/1')

        await page.getByText('Despesas').click()
        await page.click('.adicionar')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-despesas/1')

        await page.fill('input#tipoDespesa', 'Comida')
        await page.fill('input#gasto', '30')
        await page.fill('input#data', '2025-06-11')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Despesa cadastrada com sucesso!')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/info-viagem/1')
        
        await page.getByText('Despesas').click()
        await expect(page).toHaveURL('http://localhost:5173/info-viagem/1')

        const primeiroItem = page.locator('.listagens .icone').first()
        await primeiroItem.click()

        await page.fill('input#tipoDespesa', 'Transporte')
        await page.fill('input#gasto', '30')
        await page.fill('input#data', '2025-06-11')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Despesa atualizada com sucesso!')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/info-viagem/1')

        await primeiroItem.click()

        await page.click('.excluir')
        await page.click('.confirmar')
        await expect(page.locator('text=Despesa excluída com sucesso!')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/info-viagem/1')
    })
})