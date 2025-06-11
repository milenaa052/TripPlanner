import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {

    test('O usuário irá fazer o login com sucesso', async ({ page }) => {
        await page.goto('http://localhost:5173/login')
        await page.fill('input#email', 'milena@gmail.com')
        await page.fill('input#senha', 'TripPlanner03@')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('http://localhost:5173')
        await expect(page.locator('text=Adicione o seu destino')).toBeVisible()
    })
})
