import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {

    test('O usuário irá fazer o login com sucesso', async ({ page }) => {
        await page.goto('https://tripplanner.local/login')
        await page.fill('input#email', 'milena@gmail.com')
        await page.fill('input#senha', 'TripPlanner03@')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('https://tripplanner.local')
        await expect(page.locator('text=Adicione o seu destino')).toBeVisible()
    })

    test('Deve mostrar uma mensagem de erro para credenciais de login inválidas', async ({ page }) => {
        await page.goto('https://tripplanner.local/login')
        await page.fill('input#email', 'invalido@example.com')
        await page.fill('input#senha', 'senha_incorreta')
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Email ou senha inválidos')).toBeVisible()
        await expect(page).toHaveURL('https://tripplanner.local/login')
    })
})
