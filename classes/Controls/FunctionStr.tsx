import * as math from 'mathjs';
import { obj, object_types } from '@/classes/vizobjects/obj';
import React, { useState, useEffect, useCallback } from 'react';
import { getObjectSelector, getObjectsSelector, useStore } from '@/app/store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { atts } from '../vizobjects/get_set_obj_attributes';

interface AttributePairGet {
    obj_id: number;
    symbol: string;
    obj_type: object_types;
    attribute: string;
}

export class FunctionStr {
    id: number;
    functionString: string;
    symbols: AttributePairGet[];
    
    constructor(id: number, functionString: string, symbols: AttributePairGet[]) {
        this.id = id;
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
                console.log(this.symbols)
                this.symbols.forEach(symbol => {
                    const obj = getState().vizobjs[symbol.obj_id];
                    if (obj && atts[symbol.obj_type]) {
                        const getter = atts[symbol.obj_type]?.number[symbol.attribute]?.get_attribute;
                        if (getter) {
                            console.log(getter(obj))
                            scope[symbol.symbol] = getter(obj) || 0;
                        }
                    }
                });
                console.log(scope)
                return compiledExpression.evaluate(scope);
            };
        } catch (error) {
            console.error(`Error parsing function: ${error}`);
            return (x: number) => x; // Return the identity function if there's an error
        }
    }

    dataBaseSave(): FunctionStrConstructor {
        return {
            id: this.id,
            functionString: this.functionString,
            symbols: this.symbols,
        };
    }
}

export interface FunctionStrConstructor {
    id: number;
    functionString: string;
    symbols: AttributePairGet[];
}

export interface FunctionStrEditorProps {
    value: FunctionStr;
    onChange: (value: FunctionStr) => void;
}

export const FunctionStrEditor: React.FC<FunctionStrEditorProps> = ({ value, onChange }) => {
    const [functionString, setFunctionString] = useState(value.functionString);
    const [symbols, setSymbols] = useState(value.symbols);

    const objects = useStore(getObjectsSelector);

    const updateFunction = useCallback(() => {
        if (value.functionString !== functionString || !arraysEqual(value.symbols, symbols)) {
            onChange(new FunctionStr(value.id, functionString, symbols));
        }
    }, [functionString, symbols, onChange, value.id, value.functionString, value.symbols]);

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
        <div className="space-y-4">
            <Input
                type="text"
                value={functionString}
                onChange={(e) => setFunctionString(e.target.value)}
                placeholder="Function string (e.g., 2*x + sin(y))"
                className="w-full"
            />
            {symbols.map((symbol, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <div className="flex-grow space-y-2">
                        <Input
                            type="text"
                            value={symbol.symbol}
                            onChange={(e) => updateSymbol(index, { symbol: e.target.value })}
                            placeholder="Symbol (e.g., y)"
                            className="w-full"
                        />
                        <Select
                            value={symbol.obj_id.toString()}
                            onValueChange={(value) => {
                                const selectedObj = objects.find(obj => obj.id === parseInt(value));
                                if (selectedObj) {
                                    updateSymbol(index, { obj_id: selectedObj.id, obj_type: selectedObj.type as object_types, attribute: '' });
                                }
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an object" />
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
                            <Select
                                value={symbol.attribute}
                                onValueChange={(value) => {
                                    updateSymbol(index, { attribute: value });
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select attribute" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(atts[symbol.obj_type]?.number || {}).map((attr) => (
                                        <SelectItem key={attr} value={attr}>
                                            {attr}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <Button
                        onClick={() => removeSymbol(index)}
                        variant="ghost"
                        size="icon"
                        className="self-center"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                onClick={addSymbol}
                variant="outline"
                className="w-full mt-3"
            >
                Add Symbol
            </Button>
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