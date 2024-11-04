import * as math from 'mathjs';
import { obj, object_types } from '@/classes/vizobjects/obj';
import React, { useState, useEffect, useCallback } from 'react';
import { getObjectSelector, getObjectsSelector, useStore } from '@/app/store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, ChevronDown, ChevronRight, Variable, Plus } from "lucide-react";
import { atts } from '../vizobjects/get_set_obj_attributes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

export interface AttributePairGet {
    obj_id: number;
    symbol: string;
    obj_type: object_types;
    attribute: string;
}

export class FunctionStr {
    functionString: string;
    symbols: AttributePairGet[];
    
    constructor(functionString: string, symbols: AttributePairGet[]) {
        this.functionString = functionString;
        this.symbols = symbols;
    }

    get_function(): (x: number, getState: () => any) => number {
        return this.parseFunction(this.functionString)
    }
    
    private parseFunction(functionString: string): (x: number, getState: () => any) => number {
        try {
            const compiledExpression = math.compile(functionString);
            
            return (x: number, getState: () => any) => {
                const scope: { [key: string]: number } = { x };
                
                // Add all symbols to the scope, even if they don't have a value yet
                this.symbols.forEach(symbol => {
                    if (!(symbol.symbol in scope)) {
                        scope[symbol.symbol] = 0; // Default to 0 if not set
                    }
                });
    
                // Now update the values for symbols that have objects and attributes
                // console.log(this.symbols)
                this.symbols.forEach(symbol => {
                    const obj = getState().vizobjs[symbol.obj_id];
                    if (obj && atts[symbol.obj_type]) {
                        const getter = atts[symbol.obj_type]?.number[symbol.attribute]?.get_attribute;
                        if (getter) {
                            // console.log(getter(obj))
                            scope[symbol.symbol] = getter(obj) || 0;
                        }
                    }
                });
                // console.log(scope)
                return compiledExpression.evaluate(scope);
            };
        } catch (error) {
            console.error(`Error parsing function: ${error}`);
            return (x: number) => x; // Return the identity function if there's an error
        }
    }


}

export interface FunctionStrConstructor {
    functionString: string;
    symbols: AttributePairGet[];
}

export interface FunctionStrEditorProps {
    value: FunctionStr;
    onChange: (value: FunctionStr) => void;
}

export const FunctionStrEditor: React.FC<FunctionStrEditorProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [functionString, setFunctionString] = useState(value.functionString);
    const [symbols, setSymbols] = useState(value.symbols);

    const objects = useStore(getObjectsSelector);

    const updateFunction = useCallback(() => {
        if (value.functionString !== functionString || !arraysEqual(value.symbols, symbols)) {
            onChange(new FunctionStr(functionString, symbols));
        }
    }, [functionString, symbols, onChange, value.functionString, value.symbols]);

    useEffect(() => {
        updateFunction();
    }, [updateFunction]);

    const updateSymbol = (index: number, updates: Partial<AttributePairGet>) => {
        const newSymbols = symbols.map((symbol, i) => 
            i === index ? { ...symbol, ...updates } : symbol
        );
        setSymbols(newSymbols);
    };

    const addSymbol = () => {
        setSymbols([...symbols, { obj_id: -1, symbol: '', obj_type: 'Obj', attribute: '' }]);
    };

    const removeSymbol = (index: number) => {
        setSymbols(symbols.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {/* Transform Function Section */}
            <div className="mt-4">
                <label className="text-sm font-medium flex items-baseline justify-between mb-3">
                    <div>
                        Transform Function
                        <span className="text-muted-foreground ml-2 text-xs">
                            Define how the value should be transformed
                        </span>
                    </div>
                </label>
                <div className="mt-3">
                    <Input
                        type="text"
                        value={functionString}
                        onChange={(e) => setFunctionString(e.target.value)}
                        placeholder="Enter function (e.g., 2*x + y)"
                        className="w-full"
                    />
                </div>
            </div>
            {symbols.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 px-1">
                    <span className="text-xs text-muted-foreground">Using:</span>
                    {symbols.map((symbol) => (
                        <Badge 
                            key={symbol.symbol} 
                            variant="secondary"
                            className="text-xs"
                        >
                            {symbol.symbol}
                        </Badge>
                    ))}
                </div>
            )}

            {/* Variables Section */}
            <div className="rounded-lg border bg-muted/30">
                {/* Variables Header */}
                <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Variable className="h-4 w-4" />
                        <span className="text-sm font-medium">Variables</span>
                        
                    </div>
                    <div className="flex items-center gap-2">
                        {symbols.length > 1 && (
                            <Button
                                onClick={() => setSymbols([])}
                                variant="ghost"
                                size="sm"
                                className="h-7 text-muted-foreground hover:text-destructive"
                            >
                                Clear All
                            </Button>
                        )}
                        <Button
                            onClick={addSymbol}
                            variant="outline"
                            size="sm"
                            className="h-7 px-3"
                        >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Variable
                        </Button>
                    </div>
                </div>

                {/* Variables List */}
                <div className="p-3">
                    {symbols.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-6">
                           Add a variable to reference external object properties.
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {symbols.map((symbol, index) => (
                                <div 
                                    key={index} 
                                    className="grid grid-cols-[1fr,1fr,auto] gap-3 items-start bg-background rounded-md border p-3"
                                >
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Variable Name
                                        </label>
                                        <Input
                                            type="text"
                                            value={symbol.symbol}
                                            onChange={(e) => updateSymbol(index, { symbol: e.target.value })}
                                            placeholder="e.g. radius"
                                            className="h-8 text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Object
                                        </label>
                                        <Select
                                            value={symbol.obj_id.toString()}
                                            onValueChange={(value) => {
                                                const selectedObj = objects.find(obj => obj.id === parseInt(value));
                                                if (selectedObj) {
                                                    updateSymbol(index, { 
                                                        obj_id: selectedObj.id, 
                                                        obj_type: selectedObj.type as object_types,
                                                        attribute: '' 
                                                    });
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="h-8 text-sm">
                                                <SelectValue placeholder="Select object" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {objects.map((obj) => (
                                                    <SelectItem key={obj.id} value={obj.id.toString()}>
                                                        {obj.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {symbol.obj_id !== -1 && atts[symbol.obj_type] && (
                                            <div className="mt-1.5">
                                                <label className="text-xs font-medium text-muted-foreground">
                                                    Property
                                                </label>
                                                <Select
                                                    value={symbol.attribute}
                                                    onValueChange={(value) => updateSymbol(index, { attribute: value })}
                                                >
                                                    <SelectTrigger className="h-8 text-sm mt-1">
                                                        <SelectValue placeholder="Select property" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.keys(atts[symbol.obj_type]?.number || {}).map((attr) => (
                                                            <SelectItem key={attr} value={attr}>
                                                                {attr}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => removeSymbol(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive mt-6"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Variable Preview */}
            
        </div>
    );
};

// Helper function to compare arrays
function arraysEqual(a: any[], b: any[]) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
    }
    return true;
}

export default FunctionStr;