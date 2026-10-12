import { describe, it, expect } from 'vitest';
import { demoKey, demos, plans } from './content';
describe('Routes des sites de démonstration',()=>{
 it.each(Object.keys(demos))('résout /demos/%s',key=>{expect(demoKey(`/demos/${key}`)).toBe(key);expect(demoKey(`/demos/${key}/`)).toBe(key);});
 it.each(['/','/demos/inconnu','/demos/toString','/autre/boulangerie'])('rejette %s',path=>expect(demoKey(path)).toBeNull());
});
describe('Offres commerciales',()=>{it('expose les trois tarifs demandés et leurs limites',()=>{expect(plans.map(p=>p.price)).toEqual([50,100,150]);plans.forEach(p=>{expect(p.features.length).toBeGreaterThan(0);expect(p.limit.length).toBeGreaterThan(0);});});});
