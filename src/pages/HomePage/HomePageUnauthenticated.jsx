import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePageUnauthenticated() {
    return (
        <div className="mx-auto">
            <div className="relative mb-6">
                <img src="/images/brew-img-4.jpg" alt="Coffee Brewing" className="w-full object-cover opacity-80" style={{ height: '400px' }} />
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold text-white">welcome to brewista</h1>
                    <p className="text-lg text-white">your personal coffee brewing companion</p>
                </div>
            </div>

            <div className="flex flex-col items-center p-4">
                <div className="w-full lg:max-w-2xl mb-6">
                    <img src="/images/brew-img-1.jpg" alt="Discover New Recipes" className="w-full object-cover" style={{ height: '300px' }} />
                    <div className="bg-gray-200 p-4">
                        <h2 className="font-semibold text-xl mb-2">Discover New Recipes</h2>
                        <p>Explore a wide range of coffee recipes and brewing techniques from enthusiasts around the world.</p>
                        <Link to="/auth" className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Sign Up to Explore
                        </Link>
                    </div>
                </div>

                <div className="w-full lg:max-w-2xl mb-6 ">
                    <img src="/images/brew-img-5.jpg" alt="Share Your Creations" className="w-full object-cover" style={{ height: '300px' }} />
                    <div className="bg-gray-100 p-4">
                        <h2 className="font-semibold text-xl mb-2">Share Your Creations</h2>
                        <p>Join our community and share your own coffee recipes, experiences, and brewing tips.</p>
                        <Link to="/auth" className="mt-3 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Join Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
