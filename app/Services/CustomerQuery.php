<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Services\Filter;

class CustomerQuery extends Filter {
    protected $safeParms = [
        'name' => ['eq'],
        'id' => ['eq'],
    ];

    protected $columnMap = [
        'name' => 'name',
        'id' => 'id',
    ];

    protected $operatorMap = [
        'eq' => '=',
        'gt' => '>',
        'gte' => '>=',
        'lt' => '<',
        'lte' => '<=',
    ];

    public function transform(Request $request){
        $eloQuery = [];

        foreach ($this->safeParms as $parm => $operators) {
            $query =  $request->query($parm);

            if (!isset($query)) {
                continue;
            }

            $column = $this->columnMap[$parm];

            foreach ($operators as $operator) {
                if (isset($query[$operator])) {
                    $eloQuery[] = [$column, $this->operatorMap[$operator], $query[$operator]];
                }
            }
        }

        return $eloQuery;
    }
}