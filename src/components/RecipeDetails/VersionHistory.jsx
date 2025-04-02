import React, { useMemo, useEffect, useRef } from 'react';
import { GitBranch, GitCommit, GitMerge } from 'lucide-react';

export function VersionHistory({ versions, versionTree, selectedVersion, currentVersion, onVersionSelect }) {

    // use refs to autoscroll selected version 
    const selectedVersionRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Scroll the selected version
        if (selectedVersionRef.current) {
            // Added delay for rendering issues 
            setTimeout(() => {
                selectedVersionRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }, 100);
        }
    }, [selectedVersion, versions]);


    // Refactor to use version 'tree' with fallback 
    const groupedVersions = useMemo(() => {
        if (versionTree) return versionTree;
        
        // Create our grouping if tree isn't present for some reason 
        return versions?.reduce((acc, ver) => {
            const [major] = ver.version.split('.');
            if (!acc[major]) acc[major] = [];
            acc[major].push(ver);
            return acc;
        }, {}) || {};
    }, [versions, versionTree]);

    // Sort by major version (also avoid 1, 10, 2 issue due to being string)
    const sortedMajorVersions = useMemo(() => {
        return Object.keys(groupedVersions)
            .map(key => parseInt(key))
            .sort((a, b) => a - b);
    }, [groupedVersions]);

    // Sort versions within each major group
    const sortedGroupedVersions = useMemo(() => {
        const result = {};
        
        sortedMajorVersions.forEach(major => {
            const versionsInGroup = groupedVersions[major];
            
            // Check for versions (edge case with the tetsu recipe)
            if (!versionsInGroup || !versionsInGroup.length) {
                result[major] = [];
                return;
            }
            
            // sort within the group
            // Main versions first, then branch versions sorted by minor number
            result[major] = [...versionsInGroup].sort((a, b) => {
                // Main versions 
                const aIsMain = a.version.endsWith('.0');
                const bIsMain = b.version.endsWith('.0');
                
                if (aIsMain && !bIsMain) return -1;
                if (!aIsMain && bIsMain) return 1;
                
                // if both are same type, sort by minor version number
                const minorA = parseFloat(a.version.split('.')[1]);
                const minorB = parseFloat(b.version.split('.')[1]);
                return minorA - minorB;
            });
        });
        
        return result;
    }, [groupedVersions, sortedMajorVersions]);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Version History</h3>
            
            {/* scrollable container with ref to scroll into view // need to test responsiveness // */}
            <div ref={containerRef} className="space-y-4 overflow-y-auto md:max-h-[600px] max-h-[500px]">
                {sortedMajorVersions.map(major => (
                    <div key={major} className="border-l-2 border-gray-200 pl-4">
                        {sortedGroupedVersions[major]?.map((version) => (
                            <div 
                                key={version.version}
                                ref={version.version === selectedVersion ? selectedVersionRef : null}
                                className={`relative mb-4 cursor-pointer transition-colors ${
                                    version.version === selectedVersion 
                                        ? 'bg-blue-50' 
                                        : 'hover:bg-gray-50'
                                } rounded-lg p-3`}
                                onClick={() => onVersionSelect(version.version)}
                            >
                                {/* version indicator line */}
                                <div className="absolute -left-[21px] top-1/2 transform -translate-y-1/2">
                                    {version.version.endsWith('.0') ? (
                                        <GitCommit className="w-5 h-5 text-blue-500" style={{ transform: 'rotate(90deg) translateY(30%)'}}/>
                                    ) : version.parentVersion ? (
                                        <GitBranch className="w-5 h-5 text-green-500" style={{ transform: 'translateX(-5%)'}}/>
                                    ) : (
                                        <GitMerge className="w-5 h-5 text-purple-500" />
                                    )}
                                </div>

                                {/* content to render within the 'card' */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">v{version.version}</span>
                                            {/* {(version.isCurrent || version.version === currentVersion) && ( */}
                                            {(version.version === currentVersion) && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {version.createdBy?.username} • {
                                                new Date(version.createdAt).toLocaleDateString()
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* changes description without values, since step changes are massive  */}
                                {version.changes?.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {version.changes.map((change, idx) => (
                                            <div key={idx} className="text-sm text-gray-600">
                                                • {change.description}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Parent version  */}
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