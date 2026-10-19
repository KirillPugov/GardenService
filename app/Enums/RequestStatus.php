<?php

namespace App\Enums;

enum RequestStatus: string
{
    case New = 'new';
    case InProgress = 'in_progress';
    case Done = 'done';
    case Cancelled = 'cancelled';
    
    public function label(): string
    {
        return match ($this) {
            self::New => 'Новая',
            self::InProgress => 'В работе',
            self::Done => 'Выполнена',
            self::Cancelled => 'Отменена'
        };
    }

    public function color(): string
    {

    return match ($this) {
        self::New => 'blue',
        self::InProgress => 'amber',
        self::Done => 'green',
        self::Cancelled => 'red'
        };
    }
}
