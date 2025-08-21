import React, { useState, useEffect } from 'react';

const Pagestats = () => {
    const stats = [
        {
            label: 'Registered Users',
            value: 400,
            suffix: '+'
        },
        {
            label: 'Trusted Deliveries',
            value: 140,
            suffix: '+'
        },
        {
            label: 'Unique Products',
            value: 20,
            suffix: '+'
        }
    ];

    const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
    const [hasAnimated, setHasAnimated] = useState(false);

    const animateValue = (start, end, duration, callback) => {
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = start + (end - start) * easeOutCubic;

            callback(Math.floor(currentValue));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };


    const formatValue = (value, stat, index) => {
        return `${value}${stat.suffix}`;
    };


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);


                        stats.forEach((stat, index) => {
                            setTimeout(() => {
                                animateValue(0, stat.value, 2000, (value) => {
                                    setAnimatedValues(prev => {
                                        const newValues = [...prev];
                                        newValues[index] = value;
                                        return newValues;
                                    });
                                });
                            }, index * 200);
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );

        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    return (
        <section id="stats-section" className="py-20 px-5 border border-gray-200 rounded-xl bg-gradient-to-bl from-brand-orange to-orange-600  overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        Trusted, Transformed, Transfered
                    </h2>
                    <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed">
                        "We delivered products, and people trusted us with their time."
                    </p>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="mx-auto flex max-w-xs flex-col gap-y-4 group"
                        >
                            <dt className="text-base text-gray-50 font-bold leading-relaxed">
                                {stat.label}
                            </dt>
                            <dd className="order-first text-3xl md:text-4xl lg:text-5xl font-bold text-gray-50  leading-none transition-all duration-300">
                                {formatValue(animatedValues[index], stat, index)}
                            </dd>
                            <div className="w-12 h-0.5 bg-gray-200 mx-auto group-hover:bg-gray-900 transition-colors duration-300" />
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
};

export default Pagestats;
