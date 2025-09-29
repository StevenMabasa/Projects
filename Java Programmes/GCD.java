import java.util.Scanner;

public class GCD {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("A : ");
            int A = scanner.nextInt();
            System.out.print("B : ");
            int B = scanner.nextInt();

            if (A == B) {
                System.out.print("GCD : ");
                System.out.println(A);
            }

            else {
                int limit;
                int gcd = 0;
                if (A > B) {
                    limit = A;
                    for (int i=1; i<=limit; i++) {
                        if (A%i==0 && B%i==0) {
                            gcd = i;
                        }
                    }
                }
                else {
                    limit = B;
                    for (int i=1; i<=limit; i++) {
                        if (A%i==0 && B%i==0) {
                            gcd = i;
                        }
                    }
                }
                System.out.print("GCD : ");
                System.out.println(gcd);
            }
        }
    }
}
