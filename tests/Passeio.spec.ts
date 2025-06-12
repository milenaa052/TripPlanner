import { test, expect } from '@playwright/test'

test.describe('Teste do Crud de Passeio', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login')
        await page.fill('input#email', 'milena@gmail.com')
        await page.fill('input#senha', 'TripPlanner03@')
        await page.click('button[type="submit"]')
        
        await page.waitForURL('http://localhost:5173/', { timeout: 10000 })

        await page.locator('.viagemCadastrada').first().click()
    })

    test('O usuário irá criar, listar, ataulizar e remover um passeio com sucesso', async ({ page }) => {
        
        await page.goto('http://localhost:5173/info-viagem/1')

        await page.getByText('Passeios').click()
        await page.getByText('02/05').click()
        await page.click('.adicionar')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-passeio/1?data=2025-05-02%2000:00:00')
        const inputOrigem = page.locator('.input').first()
        await inputOrigem.fill('Hotel Quirinale')
        
        await page.fill('input#horaInicial', '10:00')
        await page.fill('input#horaFinal', '12:00')
        await page.fill('input#gasto', '25')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Passeio cadastrado com sucesso!')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/info-viagem/1')
        
        await page.getByText('Passeios').click()
        await page.getByText('02/05').click()
        await expect(page).toHaveURL('http://localhost:5173/info-viagem/1')

        const primeiroItem = page.locator('.listagens .icone').first()
        await primeiroItem.click()
        const editaPasseio = page.locator('.input').first()
        await editaPasseio.fill('Pisa')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Passeio atualizado com sucesso!')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/?data=2025-05-02%2000:00:00')

        await primeiroItem.click()
        await page.click('.excluir')
        await page.click('.confirmar')
        await expect(page.locator('text=Passeio excluído com sucesso!')).toBeVisible()
        await expect(page).toHaveURL('http://localhost:5173/?data=2025-05-02%2000:00:00')
    })

    test('O usuário não irá conseguir cadastrar o passeio', async ({ page }) => {
        await page.goto('http://localhost:5173/info-viagem/1')

        await page.getByText('Passeios').click()
        await page.getByText('02/05').click()
        await page.click('.adicionar')

        await expect(page).toHaveURL('http://localhost:5173/cadastro-passeio/1?data=2025-05-02%2000:00:00')
        const inputOrigem = page.locator('.input').first()
        await inputOrigem.fill('Hotel Quirinale')
        
        await page.fill('input#horaInicial', '')
        await page.fill('input#horaFinal', '12:00')
        await page.fill('input#gasto', '25')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Todos os campos são obrigatórios')).toBeVisible()
    })

    test('O usuário não irá conseguir atualizar o passeio', async ({ page }) => {
        await page.goto('http://localhost:5173/info-viagem/1')

        await page.getByText('Passeios').click()
        await page.getByText('02/05').click()

        await expect(page).toHaveURL('http://localhost:5173/info-viagem/1')
        const primeiroItem = page.locator('.listagens .icone').first()
        await primeiroItem.click()
        
        const inputOrigem = page.locator('.input').first()
        await inputOrigem.fill('Hotel Quirinale')
        
        await page.fill('input#horaInicial', '10:00')
        await page.fill('input#horaFinal', '')
        await page.fill('input#gasto', '25')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Todos os campos são obrigatórios')).toBeVisible()
    })
})