import React from 'react';
import { GitBranch, GitCommit, GitMerge } from 'lucide-react';

export function VersionHistory({ versions, currentVersion, onVersionSelect }) {
    // Group versions by major version
    const groupedVersions = versions.reduce((acc, ver) => {
        const [major] = ver.version.split('.');
        if (!acc[major]) acc[major] = [];
        acc[major].push(ver);
        return acc;
    }, {});

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Version History</h3>
            <div className="space-y-4">
                {Object.entries(groupedVersions).map(([major, versions]) => (
                    <div key={major} className="border-l-2 border-gray-200 pl-4">
                        {versions.map((version) => (
                            <div 
                                key={version.version}
                                className={`relative mb-4 cursor-pointer transition-colors ${
                                    version.version === currentVersion 
                                        ? 'bg-blue-50' 
                                        : 'hover:bg-gray-50'
                                } rounded-lg p-3`}
                                onClick={() => onVersionSelect(version.version)}
                            >
                                {/* Version indicator line */}
                                <div className="absolute -left-[21px] top-1/2 transform -translate-y-1/2">
                                    {version.version.endsWith('.0') ? (
                                        <GitCommit className="w-5 h-5 text-blue-500" style={{ transform: 'rotate(90deg) translateY(30%)'}}/>
                                    ) : version.parentVersion ? (
                                        <GitBranch className="w-5 h-5 text-green-500" style={{ transform: 'translateX(-5%)'}}/>
                                    ) : (
                                        <GitMerge className="w-5 h-5 text-purple-500" />
                                    )}
                                </div>

                                {/* Version content */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">v{version.version}</span>
                                            {version.version === currentVersion && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {version.createdBy.username} • {
                                                new Date(version.createdAt).toLocaleDateString()
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Changes */}
                                {version.changes?.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {version.changes.map((change, idx) => (
                                            <div key={idx} className="text-sm text-gray-600">
                                                • {change.description}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Parent version reference */}
                                {version.parentVersion && (
                                    <div className="mt-2 text-xs text-gray-500">
                                        Branched from v{version.parentVersion}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}