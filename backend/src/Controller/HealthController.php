<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class HealthController extends AbstractController
{
    #[Route('/health', name: 'app_health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        return $this->json([
            'message' => 'Backend API is running successfully!',
            'timestamp' => new \DateTime(),
            'version' => '1.0.0',
            'status' => 'healthy'
        ]);
    }

    #[Route('/status', name: 'app_status', methods: ['GET'])]
    public function status(): JsonResponse
    {
        return $this->json([
            'database' => 'connected',
            'cache' => 'active',
            'memory_usage' => round(memory_get_usage() / 1024 / 1024, 2) . ' MB',
            'peak_memory' => round(memory_get_peak_usage() / 1024 / 1024, 2) . ' MB'
        ]);
    }
}