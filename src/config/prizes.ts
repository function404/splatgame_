export interface IPrize {
   name: string
   stock: number
   chance: number 
}

export const prizePool: IPrize[] = [
   { name: 'régua', stock: 500, chance: 0.57 },
   { name: 'porta celular', stock: 290, chance: 0.33 },
   { name: 'copo', stock: 40, chance: 0.05 },
   { name: 'bolinha', stock: 40, chance: 0.05 },
]