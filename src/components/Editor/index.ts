import dynamic from 'next/dynamic';

export const CreativeCanvas = dynamic(() => import('./CreativeCanvas'), { 
    ssr: false, 
    loading: () => null 
});

export { AdvancedFilterPanel } from './AdvancedFilterPanel';

// Using a slightly more resilient dynamic import pattern
export const TimelineEditor = dynamic<any>(() => 
    import('./TimelineEditor').then((mod: any) => mod.default || mod.TimelineEditor), 
    { 
        ssr: false, 
        loading: () => null 
    }
);
